-- SQL functions for payroll system

-- Function to create salary_components table if it doesn't exist
CREATE OR REPLACE FUNCTION create_salary_components_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS salary_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('allowance', 'bonus', 'deduction', 'tax')),
    amount NUMERIC(10, 2) NOT NULL,
    is_percentage BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
  
  -- Add RLS policies if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'salary_components' AND policyname = 'salary_components_view_policy') THEN
    ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
    
    -- Allow employees to view only their own salary components
    CREATE POLICY salary_components_view_policy ON salary_components
      FOR SELECT
      USING (employee_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM employees WHERE id = auth.uid() AND is_admin = true));
    
    -- Only admins can insert, update, or delete salary components
    CREATE POLICY salary_components_modify_policy ON salary_components
      FOR ALL
      USING (EXISTS (SELECT 1 FROM employees WHERE id = auth.uid() AND is_admin = true));
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create payroll table if it doesn't exist
CREATE OR REPLACE FUNCTION create_payroll_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL,  -- Format: YYYY-MM
    base_salary NUMERIC(12, 2) NOT NULL,
    allowances NUMERIC(12, 2) NOT NULL DEFAULT 0,
    bonuses NUMERIC(12, 2) NOT NULL DEFAULT 0,
    deductions NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    net_salary NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'processed', 'paid')),
    payment_date TIMESTAMP WITH TIME ZONE,
    present_days INTEGER,
    absent_days INTEGER,
    leave_days INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT unique_employee_month UNIQUE (employee_id, month)
  );
  
  -- Add RLS policies if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payroll' AND policyname = 'payroll_view_policy') THEN
    ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
    
    -- Allow employees to view only their own payroll records
    CREATE POLICY payroll_view_policy ON payroll
      FOR SELECT
      USING (employee_id = auth.uid() OR 
             EXISTS (SELECT 1 FROM employees WHERE id = auth.uid() AND is_admin = true));
    
    -- Only admins can insert, update, or delete payroll records
    CREATE POLICY payroll_modify_policy ON payroll
      FOR ALL
      USING (EXISTS (SELECT 1 FROM employees WHERE id = auth.uid() AND is_admin = true));
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get employee payroll details with calculated values
CREATE OR REPLACE FUNCTION get_employee_payroll_details(p_employee_id UUID)
RETURNS JSON AS $$
DECLARE
  employee_data JSON;
  components_data JSON;
  result_json JSON;
BEGIN
  -- Get employee details
  SELECT 
    json_build_object(
      'id', e.id,
      'name', e.name,
      'department', COALESCE(e.department, ''),
      'designation', COALESCE(e.designation, ''),
      'employee_id', COALESCE(e.employee_id, ''),
      'profile_image', e.profile_image,
      'base_salary', COALESCE(e.salary, 0)
    ) INTO employee_data
  FROM employees e
  WHERE e.id = p_employee_id;
  
  -- Get salary components
  SELECT 
    json_agg(
      json_build_object(
        'id', sc.id,
        'name', sc.name,
        'type', sc.type,
        'amount', sc.amount,
        'is_percentage', sc.is_percentage,
        'description', sc.description
      )
    ) INTO components_data
  FROM salary_components sc
  WHERE sc.employee_id = p_employee_id;
  
  -- Combine the data
  SELECT 
    json_build_object(
      'employee', employee_data,
      'salary_components', COALESCE(components_data, '[]'::json)
    ) INTO result_json;
    
  RETURN result_json;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate attendance statistics for an employee for a specific month
CREATE OR REPLACE FUNCTION calculate_attendance_stats(p_employee_id UUID, p_month VARCHAR)
RETURNS JSON AS $$
DECLARE
  start_date DATE;
  end_date DATE;
  present_days INTEGER := 0;
  absent_days INTEGER := 0;
  leave_days INTEGER := 0;
  result_json JSON;
BEGIN
  -- Parse the month string (format: YYYY-MM)
  start_date := (p_month || '-01')::DATE;
  end_date := (start_date + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
  
  -- Count present days
  SELECT COUNT(*) INTO present_days
  FROM attendance
  WHERE employee_id = p_employee_id
    AND DATE(check_in_time) BETWEEN start_date AND end_date
    AND check_out_time IS NOT NULL;
  
  -- Count leave days
  SELECT COUNT(*) INTO leave_days
  FROM leave_requests
  WHERE employee_id = p_employee_id
    AND status = 'approved'
    AND (
      (start_date BETWEEN start_date AND end_date) OR
      (end_date BETWEEN start_date AND end_date) OR
      (start_date <= start_date AND end_date >= end_date)
    );
  
  -- Calculate absent days (assuming 22 working days per month, adjust as needed)
  -- This is a simplified calculation, in a real system you would account for weekends, holidays, etc.
  absent_days := 22 - present_days - leave_days;
  IF absent_days < 0 THEN
    absent_days := 0;
  END IF;
  
  -- Create result JSON
  SELECT 
    json_build_object(
      'present_days', present_days,
      'absent_days', absent_days,
      'leave_days', leave_days
    ) INTO result_json;
    
  RETURN result_json;
END;
$$ LANGUAGE plpgsql;
