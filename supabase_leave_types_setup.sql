-- Setup for leave types and leave balances

-- Create leave_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS leave_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create leave_balances table if it doesn't exist
CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
  total_days INTEGER NOT NULL DEFAULT 0,
  used_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(employee_id, leave_type_id)
);

-- Insert default leave types if they don't exist
INSERT INTO leave_types (name, description)
SELECT 'Annual Leave', 'Regular vacation leave for personal time off'
WHERE NOT EXISTS (SELECT 1 FROM leave_types WHERE name = 'Annual Leave');

INSERT INTO leave_types (name, description)
SELECT 'Sick Leave', 'Leave for illness and medical appointments'
WHERE NOT EXISTS (SELECT 1 FROM leave_types WHERE name = 'Sick Leave');

INSERT INTO leave_types (name, description)
SELECT 'Casual Leave', 'Short-term leave for personal matters'
WHERE NOT EXISTS (SELECT 1 FROM leave_types WHERE name = 'Casual Leave');

INSERT INTO leave_types (name, description)
SELECT 'Maternity Leave', 'Leave for childbirth and postnatal care'
WHERE NOT EXISTS (SELECT 1 FROM leave_types WHERE name = 'Maternity Leave');

INSERT INTO leave_types (name, description)
SELECT 'Paternity Leave', 'Leave for new fathers after childbirth'
WHERE NOT EXISTS (SELECT 1 FROM leave_types WHERE name = 'Paternity Leave');

-- Function to initialize leave balances for all employees
CREATE OR REPLACE FUNCTION initialize_leave_balances()
RETURNS void AS $$
DECLARE
  emp RECORD;
  leave_type RECORD;
BEGIN
  -- For each employee
  FOR emp IN SELECT id FROM employees LOOP
    -- For each leave type
    FOR leave_type IN SELECT id, name FROM leave_types LOOP
      -- Set default leave balance if it doesn't exist
      INSERT INTO leave_balances (employee_id, leave_type_id, total_days, used_days)
      VALUES (
        emp.id, 
        leave_type.id, 
        CASE 
          WHEN leave_type.name = 'Annual Leave' THEN 20
          WHEN leave_type.name = 'Sick Leave' THEN 10
          WHEN leave_type.name = 'Casual Leave' THEN 5
          WHEN leave_type.name = 'Maternity Leave' THEN 180
          WHEN leave_type.name = 'Paternity Leave' THEN 10
          ELSE 0
        END,
        0
      )
      ON CONFLICT (employee_id, leave_type_id) DO NOTHING;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Apply RLS policies
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;

-- RLS policies for leave_types
CREATE POLICY leave_types_select_policy ON leave_types
  FOR SELECT USING (true); -- Everyone can view leave types

-- RLS policies for leave_balances
CREATE POLICY leave_balances_select_policy ON leave_balances
  FOR SELECT USING (
    employee_id = auth.uid() OR
    EXISTS (SELECT 1 FROM employees WHERE id = auth.uid() AND is_admin = true)
  );

-- Initialize leave balances for all employees
SELECT initialize_leave_balances();
