-- Exora Database Initialization Script
-- This script runs on first container startup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create additional schemas if needed
CREATE SCHEMA IF NOT EXISTS audit;

-- Audit log table for compliance
CREATE TABLE IF NOT EXISTS audit.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit.logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit.logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit.logs(user_id);

-- Function to log changes
CREATE OR REPLACE FUNCTION audit.log_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit.logs (table_name, record_id, action, old_data)
        VALUES (TG_TABLE_NAME, OLD.id::text, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.logs (table_name, record_id, action, old_data, new_data)
        VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit.logs (table_name, record_id, action, new_data)
        VALUES (TG_TABLE_NAME, NEW.id::text, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON SCHEMA audit IS 'Schema for audit logging and compliance';
COMMENT ON TABLE audit.logs IS 'Stores all data changes for compliance and debugging';
