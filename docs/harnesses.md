# AI Harnesses

Ralphie supports multiple AI providers through a harness abstraction.

## Supported

| Harness | Provider | Status |
|---------|----------|--------|
| `claude` | Claude Code | Default |
| `codex` | OpenAI Codex | Supported |

## Usage

```bash
ralphie run                    # Claude (default)
ralphie run --harness codex    # Codex
export RALPH_HARNESS=codex     # Set default
```

## API Keys

| Harness | Environment Variable |
|---------|---------------------|
| `claude` | `ANTHROPIC_API_KEY` |
| `codex` | `OPENAI_API_KEY` |

Ralphie delegates auth to the underlying SDKs—never stores keys directly.

## Configuration

Priority:
1. CLI flag: `--harness codex`
2. Environment: `RALPH_HARNESS=codex`
3. Config file: `.ralphie/config.yml`
4. Default: `claude`

```yaml
# .ralphie/config.yml
harness: codex
```

## Architecture

```
┌─────────────────────────────────────┐
│           Ralphie Core              │
└────────────────┬────────────────────┘
                 │
          ┌──────▼──────┐
          │   Harness   │
          │ Abstraction │
          └──────┬──────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐   ┌───▼───┐   ┌───▼───┐
│Claude │   │ Codex │   │Future │
└───────┘   └───────┘   └───────┘
```

Harnesses normalize events across providers: `tool_start`, `tool_end`, `thinking`, `message`, `error`.

## Adding Harnesses

Implement in `src/lib/harness/`:

```typescript
interface Harness {
  name: string;
  run(
    prompt: string,
    options: HarnessRunOptions,
    onEvent: (event: HarnessEvent) => void
  ): Promise<HarnessResult>;
}
```
