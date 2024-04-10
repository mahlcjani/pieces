"use client"

import AddPersonForm from "./addPerson";
import { Button, Modal, ModalDialog } from "@mui/joy";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

import { useState } from "react";

export default function AddPerson() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        <PersonAddOutlinedIcon /> Add Person
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <ModalDialog>
          <AddPersonForm />
        </ModalDialog>
      </Modal>
    </>
  );
}

