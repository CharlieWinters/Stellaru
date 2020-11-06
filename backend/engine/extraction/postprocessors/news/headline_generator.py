from engine.extraction.postprocessors.postprocessor_data import PostprocessorData


class HeadlineGenerator:
    def __init__(self, isolation_layer):
        self.isolation_layer = isolation_layer

    def name(self):
        return type(self).__name__

    def create_headline(self, title, description, snap, meta={}):
        return {
            'title': title,
            'description': description,
            'date': snap['date'],
            'date_days': snap['date_days'],
            'type': self.name(),
            'meta': meta
        }

    def generate(self, state, empire, snapshot, snapshot_hist, meta_hist, current_meta, static_meta):
        raise Exception(f'generate() not implemented in {self.name()}')
