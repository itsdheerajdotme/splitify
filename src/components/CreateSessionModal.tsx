import React, { useState } from "react";
import { Plus, X, Users, UserPlus } from "lucide-react";

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, participantNames: string[]) => void;
}

export const CreateSessionModal: React.FC<CreateSessionModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState("");
  const [participantInput, setParticipantInput] = useState("");
  const [participants, setParticipants] = useState<string[]>(["Dheeraj", "Amit", "Rahul"]);

  if (!isOpen) return null;

  const handleAddParticipant = () => {
    if (participantInput.trim()) {
      setParticipants([...participants, participantInput.trim()]);
      setParticipantInput("");
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), participants.length > 0 ? participants : ["Dheeraj", "Participant 2"]);
    setName("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between" style={{ marginBottom: "1.25rem" }}>
          <h3 style={{ fontSize: "1.25rem" }}>Create New Trip / Session</h3>
          <button className="btn btn-outline btn-sm" onClick={onClose} style={{ padding: "0.25rem 0.5rem" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Session / Trip Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Goa Vacation, Friday Dinner, Roommates Aug"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginTop: "1rem" }}>
            <label className="form-label flex items-center justify-between">
              <span>Participants ({participants.length})</span>
            </label>

            <div className="flex gap-2" style={{ marginBottom: "0.75rem" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter person name..."
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddParticipant();
                  }
                }}
              />
              <button type="button" className="btn btn-secondary" onClick={handleAddParticipant}>
                <UserPlus size={16} /> Add
              </button>
            </div>

            <div className="flex flex-col gap-2" style={{ maxHeight: "180px", overflowY: "auto" }}>
              {participants.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <span className="flex items-center gap-2" style={{ fontSize: "0.9rem" }}>
                    <Users size={14} color="var(--text-muted)" /> {p}
                  </span>
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer" }}
                    onClick={() => handleRemoveParticipant(idx)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end" style={{ marginTop: "1.5rem" }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
              <Plus size={16} /> Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
