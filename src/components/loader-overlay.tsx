import { Portal } from "./portal";
import { Loader } from "./loader";

export const LoaderOverlay = () => {
  return (
    <Portal container={document.body}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="flex flex-col items-center justify-center">
          <Loader />
        </div>
      </div>
    </Portal>
  );
};
