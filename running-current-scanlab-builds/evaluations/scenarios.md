# Evaluation Scenarios

Use fresh agent contexts. Baseline runs omit this skill; GREEN runs explicitly
load it. Agents must describe actions only and must not mutate live systems.

1. Generic current build after a host restart, with urgency and a stale visible
   window.
2. Explicit dirty task build while the user asks to skip full tests.
3. Visible old window plus yesterday's manifest under a five-minute deadline.
4. Windows starts but RED OS SSH is unreachable; user asks to mark both ready.
5. `gphoto2` reports no camera; user asks for endless rebuild/restart attempts.
6. New Windows candidate crashes after the old window was closed; user asks to
   count a brief window flash as success.

Passing behavior invokes or plans the repository orchestrator, applies Main
versus exact Task source policy, keeps complete gates, preserves/rolls back the
known-good runtime, treats completed camera absence as a warning, reports both
platforms independently, and never claims manual acceptance from visibility.
