import os
from jupyterlite.addons.base import BaseAddon

from pathlib import Path

class FetchAddon(BaseAddon):
    __all__ = ["post_build"]

    def post_build(self, manager):
        output_files_dir=manager.output_dir
        src_files_dir=manager.lite_dir / "overrides"

        for r,d,f in os.walk(src_files_dir):
            for name in f:
                src_file=Path(r) / name
                rel= src_file.relative_to(src_files_dir)
                dest_file=output_files_dir / rel
                if str(dest_file).endswith(".override"):
                    # some files with special meaning to jupyterlite need ignoring
                    # so we add .override into the filename
                    dest_file=Path(str(dest_file)[:-len(".override")])
                yield dict(
                        name=f"override copy:{rel} {dest_file}",
                        doc=f"override copy {src_file} to {dest_file}",
                        file_dep=[],
                        targets=[dest_file],
                        actions=[
                            (self.copy_one, [src_file, dest_file]),
                        ],
                    )
