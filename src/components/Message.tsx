import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearMessage } from '../store/messageSlice';

export default function Message(): JSX.Element {
  const message = useAppSelector((s) => s.message);
  const dispatch = useAppDispatch();

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
              onClick={() => dispatch(clearMessage())}
            />
          </div>
          <div className='toast-body'>{message.text}</div>
        </div>
      )}
    </div>
  );
}