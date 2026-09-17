import React from 'react';

export default function RoleGuard({ userDepartment, allowedDepartments = [], children }) {
  // Check if the user's department is permitted (Admins always get access)
  const hasAccess = allowedDepartments.includes('all') || 
                    allowedDepartments.includes(userDepartment) || 
                    userDepartment === 'admin';

  if (!hasAccess) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-[#16223F] rounded-2xl border border-red-500/30 text-center space-y-4 shadow-xl">
        <div className="text-4xl">🚫</div>
        <h2 className="text-base font-bold text-white">Access Restricted</h2>
        <p className="text-xs text-slate-400">
          Your department (<span className="text-[#FF5A00] font-bold uppercase">{userDepartment || 'Unassigned'}</span>) does not have clearance to view this desk.
        </p>
        <p className="text-[10px] text-slate-500">Please contact the CEO or System Admin if you believe this is an error.</p>
      </div>
    );
  }

  return children;
}