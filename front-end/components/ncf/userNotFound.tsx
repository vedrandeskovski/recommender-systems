import { Alert } from "@heroui/alert";

interface UserNotFound {
  text: string | undefined;
  color: "danger" | "secondary" | "default" | "primary" | "success" | "warning";
}

const UserNotFound = ({ text, color }: UserNotFound) => {
  return (
    <>
      <Alert title={text} color={color} />
    </>
  );
};

export default UserNotFound;
