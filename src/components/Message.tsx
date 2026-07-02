import { useMessage } from "../context/messageContext";
import type { MessageState } from '../context/messageContext';


export default function Message(): JSX.Element {
  const { state: message, dispatch } = useMessage();

  const handleClose = () => {
    dispatch({ type: 'CLEAR_MESSAGE' });
  };
  
  return (
    <>

      <div
        className='toast-container position-fixed'
        style={{ top: '20px', right: '15px' }}
      >
        {message.title && (
          <div
            className='toast show'
            role='alert'
            aria-live='assertive'
            aria-atomic='true'
            data-delay='3000'
          >
            <div className={`toast-header text-white bg-${message.type}`}>
              <strong className='me-auto'>{message.title}</strong>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='toast'
                aria-label='Close'
              />
            </div>
            <div className='toast-body'>{message.text}</div>
          </div>
        )}

      </div>
    </>
  );
}