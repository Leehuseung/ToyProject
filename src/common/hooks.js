import {useState} from "react";

export function useModal () {
    const [showModal, updateShowModal] = useState(false);
    const toggleModal = () => updateShowModal(state=>!state);

    return [showModal, toggleModal];
}