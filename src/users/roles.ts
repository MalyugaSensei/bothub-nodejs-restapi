export enum UserRole {
    ADMIN = 1,
}

export function hasRole(userRoles: number, role: any): boolean {
    return (userRoles & role) === role
}
