import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createHelpRequest } from '../../redux/helpRequests';
import { useModal } from '../../context/Modal'
import LocationChangeModal from '../LocationChangeModal/LocationChangeModal';
import './CreateHelpRequestModal.css'

function CreateHelpRequestModal({ onRequestCreated }) {
    const dispatch = useDispatch();
    const { closeModal, setModalContent } = useModal();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        locationId: null,
        locationDetails: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLocationSelect = () => {
        setModalContent(
            <LocationChangeModal 
                onLocationSelect={(location) => {
                    setFormData(prev => ({
                        ...prev,
                        locationId: location.id,
                        locationDetails: location
                    }));
                    setModalContent(
                        <CreateHelpRequestModal 
                            onRequestCreated={onRequestCreated}
                        />
                    );
                }}
            />
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        if (!formData.title.trim()) {
            setErrors(prev => ({ ...prev, title: 'Title is required' }));
            return;
        }
        if (!formData.description.trim()) {
            setErrors(prev => ({ ...prev, description: 'Description is required' }));
            return;
        }
        if (!formData.locationId) {
            setErrors(prev => ({ ...prev, location: 'Location is required' }));
            return;
        }

        setIsSubmitting(true);

        const requestData ={ 
            title: formData.title.trim(),
            description: formData.description.trim(),
            locationId: formData.locationId,
            categories: []
        };
        const newRequest = await dispatch(createHelpRequest(requestData));
        if (newRequest) {
            closeModal();
            onRequestCreated(newRequest);
        } else {
            setErrors({ submit: 'Failed to create help request' })
        }
        setIsSubmitting(false);
    };

    return (
        <div className='create-help-request-modal'>
            <h2>Create New Help Request</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor="title">Title</label>
                    <input 
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value}))}
                        placeholder="Enter title"
                        maxLength={100}
                    />
                    {errors.title && <span className='error'>{errors.title}</span>}
                </div>

                <div className='form-group'>
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value}))}
                        placeholder='Describe what you need help with'
                        rows={4}
                    />
                    {errors.description && <span className='error'>{errors.description}</span>}
                </div>

                <div className='form-group'>
                    <label>Location</label>
                    {formData.locationDetails ? (
                        <div className='selected-location'>
                            <p>{formData.locationDetails.name}</p>
                            <p>{formData.locationDetails.address}</p>
                            <button type="button" onClick={handleLocationSelect}>
                                Change Location
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={handleLocationSelect}>
                            Select Location
                        </button>
                    )}
                    {errors.location && <span className="error">{errors.location}</span>}
                </div>

                {errors.submit && <div className='errors'>{errors.submit}</div>}

                <div className='modal-buttons'>
                    <button type="button" className='cancel-btn' onClick={closeModal}>
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className='confirm-btn'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Request'}
                    </button>
                </div>
            </form>
        </div>
    );
}



export default CreateHelpRequestModal;