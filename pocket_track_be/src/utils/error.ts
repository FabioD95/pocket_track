import { Response } from "express";

export const errorResponse = (res: Response, error: any, nameFn: string) => {
  if (error instanceof Error) {
    res.status(500).json({ message: `${nameFn}: ${error.message}` });
  } else {
    res.status(500).json({ message: `${nameFn}: unknown error.` });
  }
};
