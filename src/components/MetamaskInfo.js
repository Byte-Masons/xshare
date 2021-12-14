import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { createTheme } from "@mui/material/styles";

export const MetamaskInfo = () => {
  const theme = createTheme({
    typography: {
      htmlFontSize: 10,
    },
  });
  return (
    <Card
      sx={{
        minWidth: 275,
        bgcolor: "#80d8ff",
      }}
    >
      <CardContent>
        <Typography variant="body2" theme={theme}>
          You must connect to the site with Metamask on the Fantom network.
          <br />
          If you switch networks then refresh the website with Fantom selected.
        </Typography>
      </CardContent>
    </Card>
  );
};
