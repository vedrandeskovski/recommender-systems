import { Spinner } from "@heroui/spinner";

interface LoadingComponentProps {
  text: string;
}

const LoadingComponent = ({ text }: LoadingComponentProps) => {
  return (
    <div className="flex justify-center">
      <Spinner size="lg" color="secondary" label={text} />
    </div>
  );
};

export default LoadingComponent;
