-- Create a stored procedure to execute SQL statements
-- This will be used by the leave request form to initialize leave balances
CREATE OR REPLACE FUNCTION execute_sql(sql_query TEXT) 
RETURNS void AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
