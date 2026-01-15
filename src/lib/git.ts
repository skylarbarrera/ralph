import { execSync } from 'child_process';

export interface GitBranchResult {
  created: boolean;
  branchName: string | null;
  error: string | null;
}

export function getCurrentBranch(cwd: string): string | null {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

export function isOnMainBranch(cwd: string): boolean {
  const branch = getCurrentBranch(cwd);
  return branch === 'main' || branch === 'master';
}

export function branchExists(cwd: string, branchName: string): boolean {
  try {
    execSync(`git rev-parse --verify ${branchName}`, { cwd, stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);
}

export function createFeatureBranch(cwd: string, title: string): GitBranchResult {
  if (!isOnMainBranch(cwd)) {
    return { created: false, branchName: null, error: null };
  }

  const slug = slugifyTitle(title);
  if (!slug) {
    return { created: false, branchName: null, error: 'Could not generate branch name from title' };
  }

  const branchName = `feat/${slug}`;

  if (branchExists(cwd, branchName)) {
    try {
      execSync(`git checkout ${branchName}`, { cwd, stdio: 'pipe' });
      return { created: false, branchName, error: null };
    } catch {
      return { created: false, branchName: null, error: `Failed to checkout ${branchName}` };
    }
  }

  try {
    execSync(`git checkout -b ${branchName}`, { cwd, stdio: 'pipe' });
    return { created: true, branchName, error: null };
  } catch {
    return { created: false, branchName: null, error: `Failed to create branch ${branchName}` };
  }
}
