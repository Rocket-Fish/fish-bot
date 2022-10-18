import db from '../db';

export type RoleGroupWithPriority = {
    id: string;
    group_id: string;
    role_id: string;
    priority: number; // integer
    created_at: number;
    updated_at: number;
};

export const roleGroupWithPriority = 'role_group_with_priority';

function makeDefaultPriority(): number {
    // Jan 1st 2022, 1:00:00 AM GMT
    const minimum = 1641013200000;
    return Math.ceil((Date.now() - minimum) / 1000);
}

export function createRoleGroupWithPriority(role_id: string, group_id: string, priority: number = makeDefaultPriority()): Promise<void> {
    return new Promise((resolve, reject) => {
        db.from<RoleGroupWithPriority>(roleGroupWithPriority)
            .insert({ role_id, group_id, priority })
            .whereNotExists(db.from<RoleGroupWithPriority>(roleGroupWithPriority).where('role_id', role_id))
            .then(() => resolve())
            .catch((e) => reject(e));
    });
}
