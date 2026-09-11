import React, { useState } from 'react';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function DisputeForm({ transactionId, onClose }) {
  const [reason, setReason] = useState('Item not as described');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  
  const db = getFirestore();
  const storage = getStorage();

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('Uploading evidence and freezing escrow...');

    try {
      let imageUrls = [];

      // 1. Upload each selected image to Firebase Storage
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const storageRef = ref(storage, `disputes/${transactionId}/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          imageUrls.push(downloadUrl);
        }
      }

      // 2. Reference the specific escrow transaction in Firebase
      const transactionRef = doc(db, 'escrowTransactions', transactionId);

      // 3. Update status to DISPUTED, save description & image URLs
      await updateDoc(transactionRef, {
        status: 'DISPUTED',
        disputeDetails: {
          reason: reason,
          description: description,
          evidenceImages: imageUrls,
          raisedAt: new Date().toISOString(),
          resolved: false,
        }
      });

      setMessage('Dispute filed successfully with photo evidence. Funds frozen.');
      
      // Close the modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Raise a Dispute & Upload Evidence</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload clear photos of the issue. This freezes the escrow funds for admin review.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleDisputeSubmit} className="space-y-4">
          {/* Reason Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Dispute</label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="Item not as described">Item not as described</option>
              <option value="Damaged or defective">Damaged or defective</option>
              <option value="Wrong item delivered">Wrong item delivered</option>
              <option value="Missing parts/accessories">Missing parts/accessories</option>
            </select>
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              rows="3"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what is wrong with the item..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            ></textarea>
          </div>

          {/* Real Firebase Storage Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Evidence Photos</label>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
            />
            {imageFiles.length > 0 && (
              <p className="text-xs text-green-600 font-medium mt-1">
                {imageFiles.length} file(s) selected for upload.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button 
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={uploading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
            >
              {uploading ? 'Uploading & Freezing...' : 'Submit Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}