import { Component } from "react";
import "./component.css";

interface MainMenuProps {
  buttons?: JSX.Element;
}

interface MainMenuState {
  currentMenuItem: string;
}

class MainMenu extends Component<MainMenuProps, MainMenuState> {
  constructor(props: MainMenuProps, context: React.Context<any>) {
    super(props);

    this.state = {
      currentMenuItem: "myorgs",
    };
  }

  render() {
    return (
      <div className="MainMenu">
        <div className="MainMenu-buttons">{this.props.buttons}</div>
      </div>
    );
  }
}

export default MainMenu;
