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
            show={!!recipe}
            onHide={handleClose}
            size="xl"
            >
            <Modal.Header closeButton >
            <Modal.Title >
                {recipe.name}
            </Modal.Title>
            
            </Modal.Header >
            <Modal.Body>
                <div className='top'>
                    {header}
                </div>
                <div className='recipe-main'>

                    <div className='left'>
                        <img src={recipe.thumbnailURL}></img>
                    </div>
                    <div className='right'>
                        <Ingredients recipe={recipe}/>
                        <Tags tags={recipe.tags}></Tags>

                    </div>

                </div>
                <div className='bottom'>
                        <Instructions recipe={recipe}></Instructions>
                    </div>
            </Modal.Body>
            <Modal.Footer>
                {footer}
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default Recipe