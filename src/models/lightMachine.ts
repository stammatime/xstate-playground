import { MachineConfig, MachineOptions, Machine } from "xstate";

// The hierarchical (recursive) schema for the states
interface LightStateSchema {
  states: {
    green: Record<string, unknown>;
    yellow: Record<string, unknown>;
    red: {
      states: {
        walk: Record<string, unknown>;
        wait: Record<string, unknown>;
        stop: Record<string, unknown>;
      };
    };
  };
}

// The events that the machine handles
type LightEvent =
  | { type: "TIMER" }
  | { type: "POWER_OUTAGE" }
  | { type: "PED_COUNTDOWN"; duration: number };

// The context (extended state) of the machine
interface LightContext {
  elapsed: number;
}

const lightMachineConfig: MachineConfig<
  LightContext,
  LightStateSchema,
  LightEvent
> = {
  key: "light",
  initial: "green",
  context: { elapsed: 0 },
  states: {
    green: {
      on: {
        TIMER: { target: "yellow" },
        POWER_OUTAGE: { target: "red" },
      },
    },
    yellow: {
      on: {
        TIMER: { target: "red" },
        POWER_OUTAGE: { target: "red" },
      },
    },
    red: {
      on: {
        TIMER: { target: "green" },
        POWER_OUTAGE: { target: "red" },
      },
      initial: "walk",
      states: {
        walk: {
          on: {
            PED_COUNTDOWN: { target: "wait" },
          },
        },
        wait: {
          on: {
            PED_COUNTDOWN: {
              target: "stop",
              cond: (context, event) => {
                return event.duration === 0 && context.elapsed > 0;
              },
            },
          },
        },
        stop: {
          // Transient transition
          always: {
            target: "#light.green",
          },
        },
      },
    },
  },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lightMachineOptions: Partial<MachineOptions<LightContext, any>> = {
  // services: {},
  // actions: {},
  // guards: {}
};

export const lightMachine = Machine<LightContext, LightStateSchema, LightEvent>(
  lightMachineConfig,
  lightMachineOptions
);
