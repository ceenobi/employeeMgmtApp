
interface ModalProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  classname?: string;
}

export default function Modal({
  id,
  title,
  children,
  isOpen,
  onClose,
  classname,
}: ModalProps) {
  return (
    <dialog
      id={id}
      className={`modal modal-bottom sm:modal-middle ${
        isOpen ? "modal-open" : ""
      }`}
    >
      <div className={`modal-box ${classname}`}>
        <h3 className="font-bold text-lg">{title}</h3>
        {children}
      </div>
      <div className="modal-backdrop bg-zinc/80" onClick={onClose} />
    </dialog>
  );
}
