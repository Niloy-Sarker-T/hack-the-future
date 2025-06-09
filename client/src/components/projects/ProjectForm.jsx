import React, { useState } from 'react';

const ProjectForm = () => {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ projectName, description, link });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Project Link</label>
                <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
                Submit Project
            </button>
        </form>
    );
};

export default ProjectForm;