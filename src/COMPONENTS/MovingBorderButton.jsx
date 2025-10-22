import { Link } from "react-router-dom";
import { Button } from "./ui/moving-border";

export const MovingBorderButton = () => (
  <Link to="/notes" className="inline-block">
    <Button
      borderRadius="1.75rem"
      className="text-white  font-semibold tracking-wide"
      duration={6000}
    >
      Browse AKTU Notes
    </Button>
  </Link>
);
