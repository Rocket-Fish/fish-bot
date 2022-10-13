import db from '../db';

export type RoleGroupOrder = {
    id: string;
    role_group_id: string;
    role_id: string;
    priority: number; // integer
    created_at: number;
    updated_at: number;
};

const tableName = 'role_groups_order';
