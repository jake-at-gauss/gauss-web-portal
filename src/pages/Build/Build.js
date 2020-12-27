import { UnstyledButton } from "../../components/Button/UnstyledButton";
import { AuthContext } from "../../context/AuthContext";

const Build = ({ logout }) => {
  return (
    <div>
      <UnstyledButton onClick={logout}>Logout</UnstyledButton>
    </div>
  );
};

export default Build;
