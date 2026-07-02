import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Dispatch } from 'redux';

export type MessageKind = '' | 'success' | 'danger' | 'info' | 'warning';

export interface MessageState {
  type: MessageKind;
  title: string;
  text: string;
}

const initialState: MessageState = { type: '', title: '', text: '' };

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    postMessage(_state, action: PayloadAction<MessageState>) {
      return action.payload;
    },
    clearMessage() {
      return initialState;
    },
  },
});

export const { postMessage, clearMessage } = messageSlice.actions;
export default messageSlice.reducer;

type SuccessRes = { data?: { message?: string } };

export function handleSuccessMessage(dispatch: Dispatch, res: SuccessRes): void {
  dispatch(postMessage({ type: 'success', title: '更新成功', text: res?.data?.message ?? '' }));
  setTimeout(() => dispatch(clearMessage()), 3000);
}

export function handleErrorMessage(dispatch: Dispatch, error: unknown): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const msgSource = (error as any)?.response?.data?.message;
  const text =
    Array.isArray(msgSource)
      ? msgSource.join('，')
      : typeof msgSource === 'string'
      ? msgSource
      : '發生未知錯誤';
  dispatch(postMessage({ type: 'danger', title: '失敗', text }));
  setTimeout(() => dispatch(clearMessage()), 3000);
}
