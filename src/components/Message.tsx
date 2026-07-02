import { useMessage } from "../context/messageContext";

export default function Message(): JSX.Element {
  const { state: message, dispatch } = useMessage();

  return (
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
        >
          <div className={`toast-header text-white bg-${message.type}`}>
            <strong className='me-auto'>{message.title}</strong>
            <button
              type='button'
              className='btn-close'
              aria-label='Close'
              onClick={() => dispatch({ type: 'CLEAR_MESSAGE' })}
            />
          </div>
          <div className='toast-body'>{message.text}</div>
        </div>
      )}
    </div>
  );
}