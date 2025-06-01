import { useState } from "react";
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
import { useApiRequest } from "../common/requester/useApiRequest";
import { action_get_profile_data } from "../common/actions";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm, Controller } from "react-hook-form";

type Step1Values = {
  latitude: number | null;
  longitude: number | null;
  peakPower: number | null;
  systemLoss: number | null;
  useHorizon: boolean;
  angle: number | null;
};
type Props = {
  onSubmit: (
      width: number,
      height: number,
      direction: Direction,
      latitude: number,
      longitude: number,
      peakPower: number,
      systemLoss: number
  ) => void;
};


type Step2Values = {
  width: number | null;
  height: number | null;
  direction: string;
};

type FormValues = Step1Values & Step2Values;

const LeftPanel: React.FC<Props> = ({ onSubmit }) => {

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleDrawerOpen = () => {
    setOpen(true);
    setStep(1);
  };

  const handleDrawerClose = () => setOpen(false);

  const {
    handleSubmit,
    control,
    register,
    formState: { errors, isSubmitting },
    watch,
    getValues,
    setValue,
  } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      latitude: null,
      longitude: null,
      peakPower: null,
      systemLoss: null,
      useHorizon: false,
      angle: null,
      width: null,
      height: null,
      direction: "north",
    },
  });

  const { execute /*, isSuccess, isPending, isError */ } = useApiRequest(
    (data: any) => {
      return action_get_profile_data(data);
    }
  );

  const directions = ["north", "NE", "east", "SE", "south", "SW", "west", "NW"];
  const watchedDir: string = watch("direction");
  const directionIndex = directions.indexOf(watchedDir);
  const nextDirection = () =>
    directions[(directionIndex + 1) % directions.length];

  const onStep1Valid = async (data: Step1Values) => {
    try {
      const payload = {
        latitude: data.latitude,
        longitude: data.longitude,
        peakPower: data.peakPower,
        systemLoss: data.systemLoss,
        useHorizon: data.useHorizon,
        angle: data.angle,
      };
      // tutaj możesz wykonać request, np.:
      // await execute(payload);
      setStep(2);
    } catch (err) {
      console.error("Błąd podczas fetchowania danych:", err);
    }
  };

  const onFinalSubmit = (data: FormValues) => {
    onSubmit(
        Number(data.width),
        Number(data.height),
        data.direction,
        Number(data.latitude),
        Number(data.longitude),
        Number(data.peakPower),
        Number(data.systemLoss)
    );


    console.log("Zawartość formularza po obu krokach:", data);
    setOpen(false);
  };

  const renderStep1 = () => (
    <Box
      component="form"
      onSubmit={handleSubmit(onStep1Valid)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "80%",
      }}
    >
      <Box>
        <Typography
          sx={{ mb: 0.5, color: "#52525B", fontSize: 14, fontWeight: 700 }}
        >
          Szerokość geograficzna *
        </Typography>
        <Controller
          name="latitude"
          control={control}
          rules={{
            required: "To pole jest wymagane",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              fullWidth
              error={!!errors.latitude}
              helperText={errors.latitude ? errors.latitude.message : ""}
              InputProps={{ sx: { py: 0 } }}
            />
          )}
        />
      </Box>

      <Box>
        <Typography
          sx={{ mb: 0.5, color: "#52525B", fontSize: 14, fontWeight: 700 }}
        >
          Długość geograficzna *
        </Typography>
        <Controller
          name="longitude"
          control={control}
          rules={{
            required: "To pole jest wymagane",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              fullWidth
              error={!!errors.longitude}
              helperText={errors.longitude ? errors.longitude.message : ""}
              InputProps={{ sx: { py: 0 } }}
            />
          )}
        />
      </Box>

      <Box>
        <Typography
          sx={{ mb: 0.5, color: "#52525B", fontSize: 14, fontWeight: 700 }}
        >
          Moc szczytowa (kW) *
        </Typography>
        <Controller
          name="peakPower"
          control={control}
          rules={{
            required: "To pole jest wymagane",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              fullWidth
              error={!!errors.peakPower}
              helperText={errors.peakPower ? errors.peakPower.message : ""}
              InputProps={{ sx: { py: 0 } }}
            />
          )}
        />
      </Box>

      <Box>
        <Typography
          sx={{ mb: 0.5, color: "#52525B", fontSize: 14, fontWeight: 700 }}
        >
          Straty systemu (%) *
        </Typography>
        <Controller
          name="systemLoss"
          control={control}
          rules={{
            required: "To pole jest wymagane",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              fullWidth
              error={!!errors.systemLoss}
              helperText={errors.systemLoss ? errors.systemLoss.message : ""}
              InputProps={{ sx: { py: 0 } }}
            />
          )}
        />
      </Box>

      <FormControlLabel
        control={
          <Controller
            name="useHorizon"
            control={control}
            render={({ field }) => (
              <Checkbox {...field} checked={field.value} size="small" />
            )}
          />
        }
        label="Uwzględnij horyzont"
      />

      <Box>
        <Typography
          sx={{ mb: 0.5, color: "#52525B", fontSize: 14, fontWeight: 700 }}
        >
          Kąt nachylenia (°)
        </Typography>
        <Controller
          name="angle"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              fullWidth
              error={!!errors.angle}
              helperText={errors.angle ? errors.angle.message : ""}
              InputProps={{ sx: { py: 0 } }}
            />
          )}
        />
      </Box>

      <Button
        type="submit"
        disabled={isSubmitting}
        sx={{
          backgroundColor: "#A3E635",
          color: "white",
          fontWeight: 600,
          mt: 2,
        }}
      >
        {isSubmitting ? (
          <CircularProgress sx={{ width: 20, height: 20, color: "white" }} />
        ) : (
          "Dalej"
        )}
      </Button>
    </Box>
  );

  const renderStep2 = () => (
    <Box
      component="form"
      onSubmit={handleSubmit(onFinalSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "80%",
      }}
    >
      <Box>
        <Typography
          sx={{ mb: 0.5, color: "#52525B", fontSize: 14, fontWeight: 700 }}
        >
          Szerokość (m)
        </Typography>
        <Controller
          name="width"
          control={control}
          rules={{
            required: "To pole jest wymagane",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              fullWidth
              error={!!errors.width}
              helperText={errors.width ? errors.width.message : ""}
              inputProps={{ step: "0.01" }}
            />
          )}
        />
      </Box>

      <Box>
        <Typography
          sx={{ mb: 0.5, color: "#52525B", fontSize: 14, fontWeight: 700 }}
        >
          Wysokość (m)
        </Typography>
        <Controller
          name="height"
          control={control}
          rules={{
            required: "To pole jest wymagane",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              type="number"
              size="small"
              fullWidth
              error={!!errors.height}
              helperText={errors.height ? errors.height.message : ""}
              inputProps={{ step: "0.01" }}
            />
          )}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
        }}
      >
        <Typography sx={{ color: "#52525B", fontSize: 14, fontWeight: 700 }}>
          Kierunek
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            const nextDir = nextDirection();
            setValue("direction", nextDir);
          }}
        >
          {watchedDir.toUpperCase()}
        </Button>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          variant="contained"
          sx={{ color: "black", fontWeight: 600, backgroundColor: "white" }}
          onClick={() => setStep(1)}
        >
          Wstecz
        </Button>
        <Button
          type="submit"
          sx={{
            backgroundColor: "#A3E635",
            color: "white",
            fontWeight: 600,
          }}
        >
          Oblicz i pokaż
        </Button>
      </Box>
    </Box>
  );

  const drawerContent = (
    <>
      {isSubmitting ? (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Proszę czekać <CircularProgress sx={{ color: "#A3E635", ml: 1 }} />
        </Box>
      ) : (
        <Card
          sx={{
            height: "100%",
            boxShadow: 3,
            borderRadius: 0,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            paddingY: 4,
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
                width: "100%",
              }}
            >
              Wypełnij pola formularza
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
              display: "flex",
              justifyContent: "center",
              gap: 4,
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: step === 1 ? "#A3E635" : "rgba(163,230,53,0.3)",
                  color: step === 1 ? "white" : "black",
                  fontWeight: step === 1 ? 700 : 400,
                }}
              >
                Krok 1
              </Box>
              <Box
                sx={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "100%",
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: step === 2 ? "#A3E635" : "rgba(163,230,53,0.3)",
                  color: step === 2 ? "white" : "black",
                  fontWeight: step === 2 ? 700 : 400,
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "50%",
                    left: "-64px",
                    width: "64px",
                    borderTop: "2px dashed",
                    borderColor:
                      step === 1 ? "#A3E635" : "rgba(163,230,53,0.3)",
                    transform: "translateY(-50%)",
                  },
                }}
              >
                Krok 2
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: 1,
            }}
          >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
          </Box>
        </Card>
      )}
    </>
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
