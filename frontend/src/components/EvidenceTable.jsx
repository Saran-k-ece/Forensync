import { useState } from 'react';
import { Edit2, Trash2, AlertCircle, X } from 'lucide-react';
import { evidenceApi } from '../services/api';

const EvidenceTable = ({ evidence, onUpdate, onDelete }) => {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [passwordModal, setPasswordModal] = useState({ open: false, item: null });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const ADMIN_PASSWORD = 'admin123';

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Collected': 'bg-blue-100 text-blue-800',
      'In Transit': 'bg-yellow-100 text-yellow-800',
      'Stored': 'bg-gray-100 text-gray-800',
      'Under Analysis': 'bg-purple-100 text-purple-800',
      'Released': 'bg-green-100 text-green-800',
    };
    return `px-2 py-1 rounded text-xs font-semibold ${classes[status] || 'bg-gray-100 text-gray-800'}`;
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  const openPasswordModal = (item) => {
    setPasswordModal({ open: true, item });
    setPasswordInput('');
    setPasswordError('');
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      const item = passwordModal.item;
      setEditingId(item._id);
      setEditForm({
        status: item.status,
        location: item.location,
        description: item.description || '',
        evidenceName: item.evidenceName,
        evidenceType: item.evidenceType,
      });
      setPasswordModal({ open: false, item: null });
    } else {
      setPasswordError('Incorrect password. Access denied!');
    }
  };

  const handleSave = async (id) => {
    setLoading(true);
    try {
      await evidenceApi.update(id, editForm);
      await evidenceApi.markViewed(id);
      onUpdate();
      setEditingId(null);
    } catch (error) {
      console.error('Error updating evidence:', error);
      alert('Failed to update evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this evidence?')) return;
    setLoading(true);
    try {
      await evidenceApi.delete(id);
      onDelete();
    } catch (error) {
      console.error('Error deleting evidence:', error);
      alert('Failed to delete evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const closeModal = () => setSelectedEvidence(null);

  if (evidence.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded shadow">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Evidence Found</h3>
        <p className="text-gray-500">
          Evidence data will appear here when received from hardware devices.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white relative">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['ID', 'Tag ID', 'Name', 'Type', 'Timestamp', 'Location', 'Status', 'Description', 'Actions'].map((title) => (
              <th key={title} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {evidence.map((item) => (
            <tr key={item._id} className={`transition-colors ${item.isNew ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
              {editingId === item._id ? (
                <>
                  <td className="px-4 py-3">{item.evidenceId}</td>
                  <td className="px-4 py-3">{item.tagId}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editForm.evidenceName}
                      onChange={(e) => setEditForm({ ...editForm, evidenceName: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editForm.evidenceType}
                      onChange={(e) => setEditForm({ ...editForm, evidenceType: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="Physical">Physical</option>
                      <option value="Digital">Digital</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Biological">Biological</option>
                      <option value="Chemical">Chemical</option>
                      <option value="Trace">Trace</option>
                      <option value="Audio/Visual">Audio/Visual</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{formatDate(item.timestamp)}</td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    >
                      {['Collected', 'In Transit', 'Stored', 'Under Analysis', 'Released'].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                      rows={2}
                      placeholder="Description"
                    />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => handleSave(item._id)} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">Save</button>
                    <button onClick={handleCancel} disabled={loading} className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-4 py-3">{item.evidenceId}</td>
                  <td className="px-4 py-3">{item.tagId}</td>
                  <td className="px-4 py-3">{item.evidenceName}</td>
                  <td className="px-4 py-3">{item.evidenceType}</td>
                  <td className="px-4 py-3">{formatDate(item.timestamp)}</td>
                  <td className="px-4 py-3">{item.location}</td>
                  <td className="px-4 py-3"><span className={getStatusBadgeClass(item.status)}>{item.status}</span></td>
                  <td className="px-4 py-3">{item.description || '-'}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openPasswordModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Password Modal */}
      {passwordModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 relative shadow-lg">
            <button onClick={() => setPasswordModal({ open: false, item: null })} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">Enter Admin Password</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border rounded mb-2"
            />
            {passwordError && <p className="text-red-600 text-sm mb-2">{passwordError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setPasswordModal({ open: false, item: null })} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handlePasswordSubmit} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative shadow-lg">
            <button onClick={closeModal} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4">Evidence Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {selectedEvidence.evidenceId}</p>
              <p><strong>Tag ID:</strong> {selectedEvidence.tagId}</p>
              <p><strong>Name:</strong> {selectedEvidence.evidenceName}</p>
              <p><strong>Type:</strong> {selectedEvidence.evidenceType}</p>
              <p><strong>Status:</strong> <span className={getStatusBadgeClass(selectedEvidence.status)}>{selectedEvidence.status}</span></p>
              <p><strong>Location:</strong> {selectedEvidence.location}</p>
              <p><strong>Description:</strong> {selectedEvidence.description || '-'}</p>
              <p><strong>Timestamp:</strong> {formatDate(selectedEvidence.timestamp)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceTable;
