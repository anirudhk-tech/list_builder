"use client";

import React from "react";
import { DeleteDataDialog } from "../features/data/delete-data-dialog";

export const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <>
    <DeleteDataDialog />
    {children}
  </>
);
