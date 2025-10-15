import { useState } from 'react';
import { Trash2, X, Edit2 } from 'lucide-react';
import { evidenceApi } from '../services/api';

const EvidenceTable = ({ evidence, onUpdate, onDelete }) => {
  const [addingId, setAddingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const [passwordModal, setPasswordModal] = useState({ open: false, item: null });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState('');

  const ADMIN_PASSWORD = 'admin123';
  const statusOptions = ['Collected', 'In Transit', 'Stored', 'Under Analysis', 'Released'];

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
      setFormData({
        evidenceName: item.evidenceName,
        evidenceType: item.evidenceType,
        location: item.location,
        status: item.status,
        description: item.description || '',
      });
      setPasswordModal({ open: false, item: null });
    } else {
      setPasswordError('Incorrect password. Access denied!');
    }
  };

  const handleAddSubmit = async (id) => {
    if (!formData.evidenceName || !formData.evidenceType || !formData.location || !formData.status) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      await evidenceApi.update(id, formData);
      onUpdate();
      setAddingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error adding evidence:', error);
      alert('Failed to add evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (id) => {
    if (!formData.evidenceName || !formData.evidenceType || !formData.location || !formData.status) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    try {
      await evidenceApi.update(id, formData);
      onUpdate();
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error editing evidence:', error);
      alert('Failed to update evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImages = async (id, files) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    try {
      const formDataObj = new FormData();
      Array.from(files).forEach((file) => formDataObj.append('images', file));
      await evidenceApi.uploadImages(id, formDataObj);
      onUpdate();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (item) => {
    setDeleteModal({ open: true, item });
    setDeletePasswordInput('');
    setDeletePasswordError('');
  };

  const handleDeleteSubmit = async () => {
    if (deletePasswordInput === ADMIN_PASSWORD) {
      const id = deleteModal.item._id;
      setLoading(true);
      try {
        await evidenceApi.delete(id);
        onDelete();
      } catch (error) {
        console.error('Error deleting evidence:', error);
        alert('Failed to delete evidence');
      } finally {
        setLoading(false);
        setDeleteModal({ open: false, item: null });
        setDeletePasswordInput('');
        setDeletePasswordError('');
      }
    } else {
      setDeletePasswordError('Incorrect password. Access denied!');
    }
  };

  if (evidence.length === 0) {
    return <div className="p-8 text-center bg-white rounded shadow"><p className="text-gray-500">No Evidence Found</p></div>;
  }

  return (
    <div className="overflow-x-auto shadow-lg rounded-lg bg-white relative">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['ID', 'Tag ID', 'Timestamp', 'Status', 'Add/Edit', 'Delete'].map(title => (
              <th key={title} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {evidence.map(item => (
            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 cursor-pointer text-blue-600 hover:underline" onClick={() => setSelectedEvidence(item)}>{item.evidenceId}</td>
              <td className="px-4 py-3">{item.tagId}</td>
              <td className="px-4 py-3">{formatDate(item.timestamp)}</td>
              <td className="px-4 py-3"><span className={getStatusBadgeClass(item.status)}>{item.status}</span></td>
              <td className="px-4 py-3">
                {addingId === item._id || editingId === item._id ? (
                  <div className="space-y-2">
                    <input type="text" placeholder="Evidence Name" value={formData.evidenceName || ''} onChange={e => setFormData({ ...formData, evidenceName: e.target.value })} className="w-full px-2 py-1 border rounded"/>
                    <select value={formData.evidenceType || ''} onChange={e => setFormData({ ...formData, evidenceType: e.target.value })} className="w-full px-2 py-1 border rounded">
                      <option value="">Select Type</option>
                      <option value="Physical">Physical</option>
                      <option value="Digital">Digital</option>
                      <option value="Documentary">Documentary</option>
                      <option value="Biological">Biological</option>
                      <option value="Chemical">Chemical</option>
                      <option value="Trace">Trace</option>
                      <option value="Audio/Visual">Audio/Visual</option>
                    </select>
                    <input type="text" placeholder="Location" value={formData.location || ''} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-2 py-1 border rounded"/>
                    <select value={formData.status || ''} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-2 py-1 border rounded">
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <textarea placeholder="Description" value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-2 py-1 border rounded" rows={2}></textarea>
                    <input type="file" multiple onChange={e => handleUploadImages(item._id, e.target.files)} className="w-full"/>
                    <div className="flex gap-2">
                      {addingId === item._id ? (
                        <button onClick={() => handleAddSubmit(item._id)} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                      ) : (
                        <button onClick={() => handleEditSubmit(item._id)} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Update</button>
                      )}
                      <button onClick={() => { setAddingId(null); setEditingId(null); setFormData({}); }} className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setAddingId(item._id)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
                    <button onClick={() => openPasswordModal(item)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"><Edit2 className="w-4 h-4"/>Edit</button>
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <button onClick={() => openDeleteModal(item)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Password Modal for Editing */}
      {passwordModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 relative shadow-lg">
            <button onClick={() => setPasswordModal({ open: false, item: null })} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <h2 className="text-lg font-bold mb-4">Enter Admin Password</h2>
            <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded mb-2"/>
            {passwordError && <p className="text-red-600 text-sm mb-2">{passwordError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setPasswordModal({ open: false, item: null })} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handlePasswordSubmit} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 relative shadow-lg">
            <button onClick={() => setDeleteModal({ open: false, item: null })} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5"/>
            </button>
            <h2 className="text-lg font-bold mb-4">Enter Admin Password to Delete</h2>
            <input type="password" value={deletePasswordInput} onChange={e => setDeletePasswordInput(e.target.value)} placeholder="Password" className="w-full px-3 py-2 border rounded mb-2"/>
            {deletePasswordError && <p className="text-red-600 text-sm mb-2">{deletePasswordError}</p>}
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteModal({ open: false, item: null })} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleDeleteSubmit} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative border-2 border-gray-300">
            <button onClick={() => setSelectedEvidence(null)} className="absolute top-4 right-4 p-1 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>

            {/* FIR Header */}
            <div className="text-center border-b-2 pb-4 mb-4">
              <h1 className="text-3xl font-bold">POLICE DEPARTMENT</h1>
              <p className="text-gray-700 font-semibold">Evidence Record / FIR Report</p>
              <p className="text-sm text-gray-500">Case No: {selectedEvidence.evidenceId}</p>
            </div>

            {/* FIR Content */}
            <div className="space-y-4 text-sm text-gray-800">
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Date & Time Recorded:</strong> {formatDate(selectedEvidence.timestamp)}</p>
                <p><strong>Status:</strong> <span className={getStatusBadgeClass(selectedEvidence.status)}>{selectedEvidence.status}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p><strong>Tag ID:</strong> {selectedEvidence.tagId}</p>
                <p><strong>Evidence Type:</strong> {selectedEvidence.evidenceType}</p>
              </div>

              <p><strong>Evidence Name:</strong> {selectedEvidence.evidenceName}</p>
              <p><strong>Location Found / Stored:</strong> {selectedEvidence.location}</p>
              <p><strong>Description / Observations:</strong> {selectedEvidence.description || '-'}</p>

              <p><strong>Submitted / Found By:</strong> {selectedEvidence.submittedBy || 'N/A'}</p>
              <p><strong>Received / Logged By Officer:</strong> {selectedEvidence.officerName || 'Admin'}</p>
              <p><strong>Complainant / Reporting Party:</strong> {selectedEvidence.complainantName || 'N/A'}</p>
              <p><strong>Contact Info:</strong> {selectedEvidence.contact || 'N/A'}</p>
              <p><strong>Chain of Custody Notes:</strong> {selectedEvidence.chainOfCustody || 'N/A'}</p>

              {/* Uploaded Images */}
              {selectedEvidence.images && selectedEvidence.images.length > 0 && (
                <div>
                  <strong>Attached Images:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEvidence.images.map((img, idx) => (
                      <img key={idx} src={img} alt={`evidence-${idx}`} className="w-32 h-32 object-cover border rounded" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Officer Signature Footer */}
            <div className="mt-6 border-t pt-4 text-right text-sm text-gray-700">
              <p>Officer In-Charge:</p>
              <p>Admin</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EvidenceTable;
