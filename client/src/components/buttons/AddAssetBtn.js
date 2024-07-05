import React from "react";
import { IconButton } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons'

export default function AddAssetBtn({ onClick }) {
  return (
    <IconButton
      colorScheme="brand"
      aria-label="Call Fred"
      borderRadius="15px"
      size="lg"
      onClick={onClick}
      icon={<AddIcon />}
    />
  );
}