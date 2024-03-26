import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Modal,
  Box,
  Paper,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ReactPlayer from "react-player";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
const CustomButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(0.5),
    padding: theme.spacing(0.5),
  },
}));
function UserRoutine() {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const token = localStorage.getItem("token");

  const fetchWorkoutPlans = async () => {
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/clientt/workout-plans",
        {
          headers: { token },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch workout plans");
      }

      const data = await response.json();
      setWorkoutPlans(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchWorkoutPlans();
  }, [token]);

  const updateWorkoutPlanStatus = async (planId, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:5000/workout-plans/${planId}`,
        {
          method: "PATCH",
          headers: {
            token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update workout plan status");
      }

      console.log("Status updated successfully", await response.json());
      fetchWorkoutPlans();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleOpenModal = (workout) => {
    setSelectedWorkout(workout);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    maxWidth: "90vw",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    overflow: "auto",
    maxHeight: "90vh",
  };

  return (
    <Container>
      <Typography
        variant="h4"
        gutterBottom
        style={{
          fontWeight: "bold",
          color: "rgb(71, 68, 68)",
          fontSize: "25px",
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        Your Customized Workout Plans
      </Typography>

      {workoutPlans.length > 0 &&
        workoutPlans.map((plan) => (
          <Accordion key={plan._id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                From {new Date(plan.start_date).toLocaleDateString("en-GB")} To{" "}
                {new Date(plan.end_date).toLocaleDateString("en-GB")}, Goal:{" "}
                {plan.goals}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginBottom: 2 }}
              >
                <Grid item>
                  <Typography>Status: {plan.status}</Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => updateWorkoutPlanStatus(plan._id, "Active")}
                    sx={{ marginRight: 1 }}
                  >
                    Activate
                  </Button>
                  <CustomButton
                    variant="outlined"
                    startIcon={<PauseCircleOutlineIcon />}
                    onClick={() => updateWorkoutPlanStatus(plan._id, "Paused")}
                  >
                    Pause
                  </CustomButton>
                  <CustomButton
                    variant="contained"
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={() =>
                      updateWorkoutPlanStatus(plan._id, "Completed")
                    }
                  >
                    Completed
                  </CustomButton>
                </Grid>
              </Grid>
              <Grid container className="d-flex align-items-center justify-content-center">
                {plan.workouts.map((workout, index) => (
                  <Grid item xs={12} md={3} lg={5} className="p-0 w-100 mr-1 d-flex align-items-center justify-content-between " style={{ height: "100px", overflow: "hidden" }} key={index}>
                    {" "}
                    <Paper
                      elevation={2}

                      sx={{ p: 2, cursor: "pointer" }}
                      onClick={() => handleOpenModal(workout)}
                      className=" h-75 w-75 d-flex align-items-center justify-content-center  overflow-hidden"
                    >
                      <Typography
                        variant="p"
                        fontSize={"18px"}
                        className="text-center"
                        color={"#8269f2"}
                      >
                        {workout.name}
                      </Typography>
                    </Paper>
                  </Grid>

                ))}

              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="workout-details-title"
        aria-describedby="workout-details-description"
      >
        <Paper elevation={3} sx={modalStyle}>
          <Stack spacing={2}>
            {selectedWorkout && (
              <>
                <Typography
                  id="workout-details-title"
                  variant="h6"
                  component="h2"
                  className="text-primary text-center fs-1"
                >
                  {selectedWorkout.name}
                </Typography>
                <Typography variant="body1">
                  <span className="fw-bolder fs-5">Description: </span>
                  {selectedWorkout.description}
                </Typography>
                <Typography variant="body1">
                  <span className="fw-bolder fs-5"> Frequency:</span>{" "}
                  {selectedWorkout.frequency}
                </Typography>
                <Typography variant="body1">
                  <span className="fw-bolder fs-5"> Duration: </span>
                  {selectedWorkout.duration} minutes
                </Typography>
                <Typography variant="body1">
                  <span className="fw-bolder fs-5"> Sets: </span>
                  {selectedWorkout.sets}, Reps: {selectedWorkout.reps}
                </Typography>
                <Typography variant="body1">
                  <span className="fw-bolder fs-5"> Rest period: </span>
                  {selectedWorkout.rest_period} seconds
                </Typography>
                <Typography variant="body1">
                  <span className="fw-bolder fs-5"> Equipment Needed: </span>
                  {selectedWorkout.equipment_needed.join(", ") || "None"}
                </Typography>
                {selectedWorkout.video_link && (
                  <ReactPlayer
                    url={selectedWorkout.video_link}
                    className="react-player"
                    width="100%"
                    height="100%"
                  />
                )}
              </>
            )}
          </Stack>
        </Paper>
      </Modal>
    </Container>
  );
}

export default UserRoutine;
