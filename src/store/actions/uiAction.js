import { types } from '../types';

// * Modal Actios
export const openModalAction = () => ({ type: types.uiModalOpen, payload: true });
export const closeModalAction = () => ({ type: types.uiModalClose, payload: false });
export const loadDataModalAction = (data) => ({ type: types.uiModalLoadDara, payload: data });
export const unloadDataModalAction = () => ({ type: types.uiModalUnloadDara, payload: null });

// * Spinner
export const activeSpinnerAction = () => ({ type: types.uiSpinnerActive });
export const desactiveSpinnerAction = () => ({ type: types.uiSpinnerDesactive });

// * Sidebar
export const activeSidebarAction = () => ({ type: types.uiSidebarActive });
export const desactiveSidebarAction = () => ({ type: types.uiSidebarDesactive });

export const uiUpdateHomeChartAction = (data) => ({ type: types.uiUpdateHomeChart, payload: data });
