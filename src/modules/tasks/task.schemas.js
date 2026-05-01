const { z } = require("zod");

const taskStatus = z.enum(["TODO", "IN_PROGRESS", "DONE"]);
const uuidParam = z.object({ id: z.string().uuid() });

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(120),
    description: z.string().max(1000).optional().or(z.literal("")),
    status: taskStatus.optional(),
    dueDate: z.string().datetime().optional().or(z.literal("")),
  }),
});

const updateTaskSchema = z.object({
  params: uuidParam,
  body: z
    .object({
      title: z.string().min(2).max(120).optional(),
      description: z.string().max(1000).optional().or(z.literal("")),
      status: taskStatus.optional(),
      dueDate: z.string().datetime().optional().or(z.literal("")),
    })
    .refine((value) => Object.keys(value).length > 0, "At least one field is required"),
});

const taskIdSchema = z.object({
  params: uuidParam,
});

const listTaskSchema = z.object({
  query: z.object({
    status: taskStatus.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
  }),
});

module.exports = { createTaskSchema, updateTaskSchema, taskIdSchema, listTaskSchema };
