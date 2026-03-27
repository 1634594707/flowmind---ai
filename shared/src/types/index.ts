/**
 * Common types shared across frontend and backend
 */

// User roles
export enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

// Agent roles
export enum AgentRole {
  REQUIREMENTS_ANALYST = 'requirements_analyst',
  ARCHITECT = 'architect',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  REVIEWER = 'reviewer',
}

// Common status types
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
export type Priority = 'critical' | 'high' | 'medium' | 'low';

// API Response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
