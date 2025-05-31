import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

type FieldConfig = {
  name: string;
  label: string;
  type: "number" | "boolean";
  required: boolean;
};

const LeftPanel = () => {
  const [open, setOpen] = useState(false);
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [peakPower, setPeakPower] = useState<number | "">("");
  const [systemLoss, setSystemLoss] = useState<number | "">("");
  const [useHorizon, setUseHorizon] = useState<boolean>(false);
  const [angle, setAngle] = useState<number | "">("");

  const fieldConfigs: FieldConfig[] = [
    {
      name: "latitude",
      label: "Szerokość geograficzna",
      type: "number",
      required: true,
    },
    {
      name: "longitude",
      label: "Długość geograficzna",
      type: "number",
      required: true,
    },
    {
      name: "peakPower",
      label: "Moc szczytowa (kW)",
      type: "number",
      required: true,
    },
    {
      name: "systemLoss",
      label: "Straty systemu (%)",
      type: "number",
      required: true,
    },
    {
      name: "useHorizon",
      label: "Uwzględnij horyzont",
      type: "boolean",
      required: false,
    },
    {
      name: "angle",
      label: "Kąt nachylenia (°)",
      type: "number",
      required: false,
    },
  ];

  const handleNumberChange =
    (setter: React.Dispatch<React.SetStateAction<number | "">>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setter(val === "" ? "" : parseFloat(val));
    };

  const handleCheckboxChange =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      latitude: latitude === "" ? null : latitude,
      longitude: longitude === "" ? null : longitude,
      peakPower: peakPower === "" ? null : peakPower,
      systemLoss: systemLoss === "" ? null : systemLoss,
      useHorizon,
      angle: angle === "" ? null : angle,
    };
    console.log("Wysłane dane:", payload);
  };

  const drawerContent = (
    <Card
      sx={{
        height: "100%",
        boxShadow: 3,
        borderRadius: 0,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        paddingY: 8,
      }}
      square
    >
      <CardContent
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            marginBottom: 1,
            color: "#A3E635",
            fontWeight: 700,
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Wprowadź podane parametry
        </Typography>
        <IconButton
          size="small"
          aria-label="zamknij"
          sx={{
            color: "black",
            position: "absolute",
            right: 16,
            top: 12,
          }}
          onClick={handleDrawerClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </CardContent>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          pt: 1,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            width: "80%",
          }}
        >
          {fieldConfigs.map((field) => {
            switch (field.type) {
              case "number":
                return (
                  <Box key={field.name}>
                    <Typography
                      sx={{
                        marginBottom: 0.5,
                        color: "#52525B",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {field.label}
                      {field.required && " *"}
                    </Typography>
                    <TextField
                      type="number"
                      required={field.required}
                      size="small"
                      fullWidth
                      value={
                        field.name === "latitude"
                          ? latitude
                          : field.name === "longitude"
                          ? longitude
                          : field.name === "peakPower"
                          ? peakPower
                          : field.name === "systemLoss"
                          ? systemLoss
                          : field.name === "angle"
                          ? angle
                          : ""
                      }
                      onChange={
                        field.name === "latitude"
                          ? handleNumberChange(setLatitude)
                          : field.name === "longitude"
                          ? handleNumberChange(setLongitude)
                          : field.name === "peakPower"
                          ? handleNumberChange(setPeakPower)
                          : field.name === "systemLoss"
                          ? handleNumberChange(setSystemLoss)
                          : field.name === "angle"
                          ? handleNumberChange(setAngle)
                          : () => {}
                      }
                      InputProps={{
                        sx: { py: 0 },
                      }}
                    />
                  </Box>
                );

              case "boolean":
                return (
                  <FormControlLabel
                    key={field.name}
                    control={
                      <Checkbox
                        checked={useHorizon}
                        onChange={handleCheckboxChange(setUseHorizon)}
                        size="small"
                      />
                    }
                    label={field.label}
                  />
                );

              default:
                return null;
            }
          })}

          <Button
            type="submit"
            sx={{
              backgroundColor: "#A3E635",
              color: "white",
              fontWeight: 600,
              mt: 1,
            }}
          >
            Wyślij
          </Button>
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleDrawerOpen}
        sx={{ m: 1 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            borderRight: "2px solid #A3E635",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default LeftPanel;
