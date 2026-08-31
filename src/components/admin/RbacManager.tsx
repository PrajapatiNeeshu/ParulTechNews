import React, { useState } from 'react';
import { Shield, UserCheck, Plus, Check, X, Lock, Key, AlertCircle } from 'lucide-react';
import { User, RoleType } from '../../types';

interface RbacManagerProps {
  users: User[];
  currentUser: User;
  onSwitchUser: (user: User) => void;
  onUpdateUserRole: (userId: string, newRole: RoleType) => void;
  onAddUser: (user: Partial<User>) => void;
}

const PERMISSION_MATRIX: Record<RoleType, string[]> = {
  super_admin: ['Create Posts', 'Edit Any Post', 'Publish Posts', 'Delete Posts', 'Manage Users & Roles', 'Manage AdSense', 'Google News SEO', 'System Settings'],
  editor: ['Create Posts', 'Edit Any Post', 'Publish Posts', 'Delete Posts', 'Google News SEO', 'Manage Media'],
  author: ['Create Posts', 'Edit Own Posts', 'Upload Media', 'Submit for Review'],
  contributor: ['Create Posts', 'Submit for Review'],
  subscriber: ['Read Articles', 'Post Comments', 'Save Bookmarks', 'WhatsApp Alerts'],
};

export const RbacManager: React.FC<RbacManagerProps> = ({
  users,
  currentUser,
  onSwitchUser,
  onUpdateUserRole,
  onAddUser,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<RoleType>('author');
  const [newUserBio, setNewUserBio] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    onAddUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      bio: newUserBio || 'Editorial contributor.',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`,
      permissions: PERMISSION_MATRIX[newUserRole],
      articlesCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    });

    setShowAddModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserBio('');
  };

  return (
    <div className="space-y-6 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-[#F27D26] text-xs font-mono font-bold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>// ACCESS CONTROL &amp; TEAM PERMISSIONS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
            Users, Authors &amp; RBAC Security
          </h2>
          <p className="text-xs text-white/50 mt-1 font-mono">
            // ACTIVE SESSION: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ').toUpperCase()})
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-mono font-bold uppercase px-5 py-2.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-lg shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* User Table */}
      <div className="bg-[#0D0D0D] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-tight text-white">Staff &amp; Contributor Directory [{users.length}]</h3>
          <span className="text-[10px] font-mono text-white/40 uppercase">// CLICK "SWITCH SESSION" TO SIMULATE ROLE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black border-b border-white/10 text-white/50 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">// USER</th>
                <th className="p-4">// ROLE</th>
                <th className="p-4">// PERMISSIONS</th>
                <th className="p-4">// ARTICLES</th>
                <th className="p-4 text-right">// ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className={u.id === currentUser.id ? 'bg-white/5' : 'hover:bg-white/5'}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <div className="font-sans font-bold text-white uppercase flex items-center gap-2">
                          {u.name}
                          {u.id === currentUser.id && (
                            <span className="text-[9px] bg-[#00FF41]/20 text-[#00FF41] font-mono font-bold px-2 py-0.5 rounded-full border border-[#00FF41]/30">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-white/40 text-[11px] font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => onUpdateUserRole(u.id, e.target.value as RoleType)}
                      className="bg-black border border-white/10 rounded-xl p-2 text-xs font-mono font-bold text-white uppercase focus:border-[#F27D26] outline-none"
                    >
                      <option value="super_admin">SUPER ADMIN</option>
                      <option value="editor">EDITOR</option>
                      <option value="author">AUTHOR</option>
                      <option value="contributor">CONTRIBUTOR</option>
                      <option value="subscriber">SUBSCRIBER</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {PERMISSION_MATRIX[u.role].slice(0, 3).map((perm, idx) => (
                        <span key={idx} className="bg-black text-white/70 text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border border-white/10 uppercase">
                          {perm}
                        </span>
                      ))}
                      {PERMISSION_MATRIX[u.role].length > 3 && (
                        <span className="text-[9px] text-white/40 font-mono">+{PERMISSION_MATRIX[u.role].length - 3} MORE</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 font-mono font-bold text-white">
                    {u.articlesCount || 0}
                  </td>

                  <td className="p-4 text-right">
                    {u.id === currentUser.id ? (
                      <span className="text-xs font-mono font-bold text-[#00FF41] flex items-center justify-end gap-1 uppercase">
                        <UserCheck className="w-4 h-4" /> ACTIVE
                      </span>
                    ) : (
                      <button
                        onClick={() => onSwitchUser(u)}
                        className="bg-white/10 hover:bg-white hover:text-black text-white font-mono font-bold uppercase px-3.5 py-1.5 rounded-full text-[10px] transition cursor-pointer"
                      >
                        Switch
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix Visualizer */}
      <div className="bg-[#0D0D0D] p-6 rounded-3xl border border-white/10 shadow-2xl">
        <h3 className="font-black text-sm uppercase tracking-tight text-white mb-4">RBAC Security Matrix</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
          {(Object.keys(PERMISSION_MATRIX) as RoleType[]).map((role) => (
            <div key={role} className="p-4 bg-black rounded-2xl border border-white/10">
              <div className="font-bold uppercase text-white mb-2.5 flex items-center justify-between">
                <span>{role.replace('_', ' ')}</span>
                <Key className="w-3.5 h-3.5 text-[#F27D26]" />
              </div>
              <ul className="space-y-1.5 text-white/60 text-[10px]">
                {PERMISSION_MATRIX[role].map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-[#00FF41] shrink-0" />
                    <span>{p.toUpperCase()}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#0D0D0D] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/10 text-white font-sans">
            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-4">Add Team Member</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block font-bold text-white/70 uppercase mb-1 text-[10px]">// FULL NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Blake"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white/70 uppercase mb-1 text-[10px]">// EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="jordan@presscore.io"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 text-white placeholder-white/30 focus:border-[#F27D26] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-white/70 uppercase mb-1 text-[10px]">// ROLE</label>
                <select
                  value={newUserRole}
                  onChange={(e: any) => setNewUserRole(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 font-bold text-white uppercase focus:border-[#F27D26] outline-none"
                >
                  <option value="super_admin">SUPER ADMIN</option>
                  <option value="editor">EDITOR</option>
                  <option value="author">AUTHOR</option>
                  <option value="contributor">CONTRIBUTOR</option>
                  <option value="subscriber">SUBSCRIBER</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-white/70 uppercase mb-1 text-[10px]">// SHORT BIO</label>
                <textarea
                  rows={2}
                  placeholder="Senior journalist specializing in AI & Cybersecurity..."
                  value={newUserBio}
                  onChange={(e) => setNewUserBio(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-2xl p-3 text-white placeholder-white/30 focus:border-[#F27D26] outline-none font-sans text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-white/10 hover:bg-white/20 text-white font-mono font-bold uppercase px-4 py-2 rounded-full cursor-pointer text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#F27D26] hover:bg-[#d96a1a] text-white font-mono font-bold uppercase px-5 py-2 rounded-full cursor-pointer text-xs shadow-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
