import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tags from './Tags'
import Ingredients from './Ingredients'
import Instructions from './Instructions'

const Recipe = ({ recipe, handleClose, header, footer } ) => {
    if (!recipe) {
        return 
    }
    return (
        <Modal 
            show={recipe}
            onHide={handleClose}
            size="xl"
            >
            <Modal.Header closeButton >
            <Modal.Title >
                {recipe.name}
            </Modal.Title>
            
            </Modal.Header >
            <Modal.Body>
                <div className='modal-top'>
                    {header}
                </div>
                <div className='modal-main'>
                    {recipe.thumbnailURL && 
                        <div className='modal-main-left'>
                            <img src={recipe.thumbnailURL}></img>
                        </div>
                    }
                    <div className='modal-main-right'>
                        <Ingredients recipe={recipe}/>
                        <Tags tags={recipe.tags}></Tags>

                    </div>

                </div>
                <div className='modal-bottom padded'>
                    <Instructions recipe={recipe}></Instructions>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <div className='modal-foot'>
                <div className='modal-foot-injects'>
                    {footer}
                </div>
                <button className="btn-default" onClick={handleClose}>
                    Close
                </button>
            </div>
            </Modal.Footer>
        </Modal>
    )
}
export default Recipe