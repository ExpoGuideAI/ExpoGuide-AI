type ChatSessionState = {
  activeConvId: number | null;
  draftMessage: string;
};

let state: ChatSessionState = {
  activeConvId: null,
  draftMessage: "",
};

export const chatSessionStore = {
  getState(): ChatSessionState {
    return state;
  },
  setActiveConversation(activeConvId: number | null) {
    state = { ...state, activeConvId };
  },
  setDraftMessage(draftMessage: string) {
    state = { ...state, draftMessage };
  },
};