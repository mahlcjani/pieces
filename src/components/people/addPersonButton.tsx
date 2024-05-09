"use client"

import AddPersonForm from "./addPerson";
import { ActionIcon, Modal } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconUserPlus } from '@tabler/icons-react';

export default function AddPerson() {
  const [opened, { open, close }] = useDisclosure(false);
  const isSmallDevice = useMediaQuery("(max-width: 50em)");

  return (
    <>
      <ActionIcon onClick={open} variant="light">
        <IconUserPlus />
      </ActionIcon>
      <Modal
        title="Add Person"
        opened={opened}
        onClose={close}
        withCloseButton={isSmallDevice}
        fullScreen={isSmallDevice}
        transitionProps={{ transition: "slide-left", duration: 400 }}
      >
        <AddPersonForm />
      </Modal>
    </>
  );
}

