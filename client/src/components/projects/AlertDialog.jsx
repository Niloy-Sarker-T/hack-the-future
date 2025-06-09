import React from 'react';

const AlertDialog = ({ onClose, onSelect }) => {
    const handleSelection = (isHackathon) => {
        onSelect(isHackathon);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-lg font-bold mb-4">My Hackathon App</h2>
                <p className="mb-4">Is this project part of a hackathon?</p>
                <div className="flex justify-around">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => handleSelection(false)}
                    >
                        No, I'm just adding it to my portfolio
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded"
                        onClick={() => handleSelection(true)}
                    >
                        Yes, I'm submitting to a hackathon
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertDialog;