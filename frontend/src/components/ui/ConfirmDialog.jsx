import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={18} className="text-red-600" />
        </div>
        <div>
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          <div className="flex gap-3 mt-5">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="btn-danger flex-1 justify-center"
            >
              {loading ? 'Deleting...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
