import { Link } from "react-router-dom";
import { Button } from "./ui/moving-border";

export const MovingBorderLoginButton = () => (
   <Link to="/login" className="inline-block">
    <Button
      borderRadius="1.75rem"
      className="text-white  font-semibold tracking-wide"
      duration={3000}
    >
      sign in
    </Button>
  </Link>
);
