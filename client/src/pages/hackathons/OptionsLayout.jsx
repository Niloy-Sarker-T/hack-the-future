import { useNavigate, useParams } from 'react-router-dom';

const OptionsLayout = () => {
    const navigate = useNavigate();
    const { hackathonId } = useParams();

    const handleOptionClick = () => {
        navigate(`/hackathons/${hackathonId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl mb-4">Choose an Option</h2>
            <button className="mb-2 p-2 bg-blue-500 text-white rounded" onClick={handleOptionClick}>
                Looking for Team
            </button>
            <button className="mb-2 p-2 bg-blue-500 text-white rounded" onClick={handleOptionClick}>
                Teams
            </button>
            <button className="mb-2 p-2 bg-blue-500 text-white rounded" onClick={handleOptionClick}>
                Solo
            </button>
        </div>
    );
};

export default OptionsLayout;