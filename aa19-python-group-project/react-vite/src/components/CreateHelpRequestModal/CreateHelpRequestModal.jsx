import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createHelpRequest, updateHelpRequestLocation } from '../../redux/helpRequests';
import { useModal } from '../../context/Modal'
import LocationChangeModal from '../LocationChangeModal/LocationChangeModal';
import './CreateHelpRequestModal.css'

function CreateHelpRequestModal({ onRequestCreated, requestId, isEdit, initialFormData, initialLocation }) {
    const dispatch = useDispatch();
    const { closeModal, setModalContent } = useModal();
    const [formData, setFormData] = useState({
        title: initialFormData?.title || '',
        description: initialFormData?.description || '',
        locationId: initialFormData?.locationId || initialLocation?.id || null,
        locationDetails: initialFormData?.locationDetails || initialLocation || null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLocationSelect = () => {
        setModalContent(
            <LocationChangeModal 
                onLocationSelect={(location) => {
                    setModalContent(
                        <CreateHelpRequestModal 
                            onRequestCreated={onRequestCreated}
                            initialLocation={location}
                            initialFormData={formData}
                            isEdit={isEdit}
                            requestId={requestId}
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
    
        const requestData = { 
            title: formData.title.trim(),
            description: formData.description.trim(),
            categories: []
        };
        
        let response;
        if (isEdit) {
            response = await dispatch(updateHelpRequestLocation(requestId, formData.locationId, requestData));
        } else {
            response = await dispatch(createHelpRequest({
                ...requestData, 
                locationId: formData.locationId}));
        }

        if (response) {
            closeModal();
            onRequestCreated(response);
        } else {
            setErrors({ submit: `Failed to ${isEdit ? 'update' : 'create'} help request` });
        }
        setIsSubmitting(false)
     
};

    return (
        <div className='create-help-request-modal'>
            <h2>{isEdit ? 'Edit Help Request' : 'Create New Help Request'}</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor="title">Title</label>
                    <input 
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            title: e.target.value
                        }))}
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
                        onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            description: e.target.value
                        }))}
                        placeholder='Describe what you need help with'
                        rows={4}
                    />
                    {errors.description && <span className='error'>{errors.description}</span>}
                </div>

                <div className='form-group'>
                    <label>Location</label>
                    {formData.locationId ? (
                        <div className='selected-location'>
                            <p>{formData.locationDetails?.name}</p>
                            <p>{formData.locationDetails?.address}</p>
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

                {errors.submit && <div className='error'>{errors.submit}</div>}

                <div className='modal-buttons'>
                    <button type="button" className='cancel-btn' onClick={closeModal}>
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className='confirm-btn'
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Request' : 'Create Request')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateHelpRequestModal;