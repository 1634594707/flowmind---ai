export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  project_manager: [
    'project.read',
    'project.update',
    'project.member.manage',
    'task.create',
    'task.read',
    'task.update',
    'task.delete',
    'document.create',
    'document.read',
    'document.update',
  ],
  developer: [
    'project.read',
    'task.create',
    'task.read',
    'task.update',
    'document.read',
    'document.update',
  ],
  viewer: ['project.read', 'task.read', 'document.read'],
};

export const SYSTEM_ROLES = [
  { code: 'admin', name: 'Admin', system: true },
  { code: 'project_manager', name: 'Project Manager', system: true },
  { code: 'developer', name: 'Developer', system: true },
  { code: 'viewer', name: 'Viewer', system: true },
] as const;
