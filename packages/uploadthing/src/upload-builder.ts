import type {
  UnsetMarker,
  UploadBuilder,
  UploadBuilderDef,
  Uploader,
  AnyRuntime,
} from "./types";

export function createBuilder<TRuntime extends AnyRuntime = "web">(
  initDef: Partial<UploadBuilderDef<TRuntime>> = {}
): UploadBuilder<{
  _metadata: UnsetMarker;
  _runtime: TRuntime;
}> {
  const _def: UploadBuilderDef<TRuntime> = {
    fileTypes: ["image"],
    maxSize: "1MB",
    maxFiles: undefined,
    // @ts-expect-error - huh?
    middleware: async () => ({}),
    ...initDef,
  };

  return {
    fileTypes(types) {
      return createBuilder({
        ..._def,
        fileTypes: types,
      });
    },
    maxSize(size) {
      return createBuilder({
        ..._def,
        maxSize: size,
      });
    },
    maxFiles(max) {
      return createBuilder({
        ..._def,
        maxFiles: max,
      });
    },
    middleware(resolver) {
      return createBuilder({
        ..._def,
        middleware: resolver,
      }) as UploadBuilder<{ _metadata: any; _runtime: TRuntime }>;
    },
    onUploadComplete(resolver) {
      return {
        _def,
        resolver,
      } as Uploader<{ _metadata: any; _runtime: TRuntime }>;
    },
  };
}
